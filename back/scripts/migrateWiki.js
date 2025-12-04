require("dotenv").config();
const mongoose = require("mongoose");

// Importar modelos
const OldArticle = require("../models/info/Article"); // Tu modelo antiguo
const WikiArticle = require("../models/info/WikiArticle"); // Nuevo modelo
const ArticleHistory = require("../models/info/ArticleHistory"); // Historial

// ========================================
// CONFIGURACIÓN
// ========================================

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cosmos-rol";

// ========================================
// FUNCIÓN DE MIGRACIÓN
// ========================================

const migrateArticles = async () => {
  try {
    console.log("🚀 Iniciando migración de artículos...\n");
    
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB\n");
    
    // Obtener todos los artículos antiguos
    const oldArticles = await OldArticle.find();
    console.log(`📄 Encontrados ${oldArticles.length} artículos para migrar\n`);
    
    if (oldArticles.length === 0) {
      console.log("⚠️  No hay artículos para migrar");
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Migrar cada artículo
    for (const oldArticle of oldArticles) {
      try {
        console.log(`⚙️  Migrando: "${oldArticle.name}"...`);
        
        // Generar slug del nombre
        const slug = oldArticle.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        
        // Verificar si ya existe un artículo con este slug
        const existing = await WikiArticle.findOne({ slug });
        if (existing) {
          console.log(`   ⚠️  Ya existe artículo con slug "${slug}", agregando timestamp`);
        }
        
        // Determinar categoría basada en el tipo o ttrpg
        let category = 'lore'; // Por defecto
        if (oldArticle.type) {
          const typeMap = {
            'regla': 'reglas',
            'rule': 'reglas',
            'guia': 'guias',
            'guide': 'guias',
            'mecanica': 'mecanicas',
            'mechanic': 'mecanicas',
            'raza': 'razas',
            'race': 'razas',
            'hechizo': 'hechizos',
            'spell': 'hechizos',
            'clase': 'clases',
            'class': 'clases',
            'item': 'items',
            'criatura': 'criaturas',
            'creature': 'criaturas'
          };
          category = typeMap[oldArticle.type.toLowerCase()] || category;
        }
        
        // Crear nuevo artículo
        const newArticleData = {
          slug: existing ? `${slug}-${Date.now()}` : slug,
          title: oldArticle.name,
          content: oldArticle.text || '',
          excerpt: oldArticle.resume || '',
          category: category,
          subcategory: oldArticle.type || '',
          tags: [],
          ttrpg: oldArticle.ttrpg || 'COSMOSROL',
          featuredImage: {
            url: oldArticle.imageURL || '',
            alt: oldArticle.name,
            caption: ''
          },
          status: 'published', // Asumimos que los antiguos están publicados
          publishedAt: oldArticle.lastModification || oldArticle.createdAt || new Date(),
          version: 1,
          author: oldArticle.lastUserModifier || 'Admin',
          lastEditor: oldArticle.lastUserModifier || 'Admin',
          seo: {
            metaTitle: oldArticle.name,
            metaDescription: oldArticle.resume || '',
            metaKeywords: [],
            ogImage: oldArticle.imageURL || ''
          },
          views: 0,
          likes: 0,
          allowComments: true,
          featured: false
        };
        
        const newArticle = new WikiArticle(newArticleData);
        await newArticle.save();
        
        // Crear entrada inicial en historial
        await ArticleHistory.createSnapshot(
          newArticle,
          newArticleData.author,
          'Artículo migrado desde sistema antiguo',
          'created'
        );
        
        console.log(`   ✅ Migrado exitosamente como: /wiki/${category}/${newArticleData.slug}`);
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ Error migrando "${oldArticle.name}":`, error.message);
        errorCount++;
        errors.push({
          article: oldArticle.name,
          error: error.message
        });
      }
    }
    
    // Resumen de migración
    console.log("\n" + "=".repeat(50));
    console.log("📊 RESUMEN DE MIGRACIÓN");
    console.log("=".repeat(50));
    console.log(`✅ Artículos migrados exitosamente: ${successCount}`);
    console.log(`❌ Artículos con errores: ${errorCount}`);
    console.log(`📄 Total procesados: ${oldArticles.length}`);
    
    if (errors.length > 0) {
      console.log("\n🔍 DETALLES DE ERRORES:");
      errors.forEach(err => {
        console.log(`   - ${err.article}: ${err.error}`);
      });
    }
    
    console.log("\n✨ Migración completada");
    
  } catch (error) {
    console.error("❌ Error fatal en la migración:", error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
};

// ========================================
// FUNCIÓN PARA REVERTIR MIGRACIÓN
// ========================================

const revertMigration = async () => {
  try {
    console.log("⚠️  REVERTIR MIGRACIÓN - Esto eliminará todos los artículos nuevos");
    console.log("Esperando 5 segundos para cancelar con Ctrl+C...\n");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB\n");
    
    const deletedArticles = await WikiArticle.deleteMany({});
    const deletedHistory = await ArticleHistory.deleteMany({});
    
    console.log(`🗑️  Eliminados ${deletedArticles.deletedCount} artículos nuevos`);
    console.log(`🗑️  Eliminadas ${deletedHistory.deletedCount} entradas de historial`);
    
  } catch (error) {
    console.error("❌ Error revirtiendo migración:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
};

// ========================================
// FUNCIÓN PARA VERIFICAR MIGRACIÓN
// ========================================

const verifyMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB\n");
    
    const oldCount = await OldArticle.countDocuments();
    const newCount = await WikiArticle.countDocuments();
    const historyCount = await ArticleHistory.countDocuments();
    
    console.log("📊 ESTADO DE LA MIGRACIÓN:");
    console.log(`   Artículos antiguos: ${oldCount}`);
    console.log(`   Artículos nuevos: ${newCount}`);
    console.log(`   Entradas de historial: ${historyCount}`);
    
    if (newCount > 0) {
      console.log("\n📄 MUESTRA DE ARTÍCULOS NUEVOS:");
      const samples = await WikiArticle.find().limit(3);
      samples.forEach(article => {
        console.log(`   - ${article.title} (${article.category}) - ${article.url}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error verificando migración:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexión cerrada");
  }
};

// ========================================
// EJECUTAR SEGÚN ARGUMENTO
// ========================================

const command = process.argv[2];

switch(command) {
  case 'migrate':
    migrateArticles();
    break;
  case 'revert':
    revertMigration();
    break;
  case 'verify':
    verifyMigration();
    break;
  default:
    console.log(`
📚 SCRIPT DE MIGRACIÓN DE WIKI

Uso: node migrateWiki.js [comando]

Comandos disponibles:
  migrate  - Migrar artículos antiguos al nuevo formato
  revert   - Revertir la migración (eliminar artículos nuevos)
  verify   - Verificar estado de la migración

Ejemplos:
  node migrateWiki.js migrate
  node migrateWiki.js verify
  node migrateWiki.js revert
    `);
    process.exit(0);
}