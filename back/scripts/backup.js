const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const backupsDir = path.join(__dirname, "backups");

fs.readdir(backupsDir, (err, files) => {
  if (err) {
    console.error("Error leyendo carpeta backups:", err);
    process.exit(1);
  }

  // Filtrar solo archivos .js (scripts de backup)
  const scripts = files.filter((f) => f.endsWith(".js"));
  if (!scripts.length) {
    console.log("No se encontraron scripts de backup en la carpeta.");
    return;
  }

  console.log(`Encontrados ${scripts.length} scripts de backup.`);

  (async function runScripts() {
    for (const script of scripts) {
      const scriptName = path.basename(script, ".js");
      const scriptPath = path.join(backupsDir, script);

      // Crear carpeta específica para este backup
      const outputDir = path.join(backupsDir, scriptName);
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

      console.log(`Ejecutando ${script} y guardando en ${outputDir}...`);

      await new Promise((resolve, reject) => {
        // Ejecutar el script pasando la carpeta de salida
        const proc = exec(
          `node "${scriptPath}" "${outputDir}"`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error ejecutando ${script}:`, error);
              return reject(error);
            }
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
          }
        );
      });
    }
    console.log(
      "Todos los backups ejecutados y guardados en carpetas individuales."
    );
  })();
});
