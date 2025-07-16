const fs = require("fs");
const path = require("path");
const heicConvert = require("heic-convert");

// 入力・出力ディレクトリの設定
const inputDir = path.join(__dirname, "./image");
const outputDir = path.join(inputDir, "../dist");

// 出力ディレクトリがなければ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ディレクトリ内のファイルを読み込んで変換
fs.readdir(inputDir, async (err, files) => {
  if (err) {
    console.error("フォルダ読み込みエラー:", err);
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === ".heic") {
      const inputPath = path.join(inputDir, file);
      const outputFileName = path.basename(file, ext) + ".jpg";
      const outputPath = path.join(outputDir, outputFileName);

      try {
        const inputBuffer = fs.readFileSync(inputPath);

        const outputBuffer = await heicConvert({
          buffer: inputBuffer,
          format: "JPEG",
          quality: 1,
        });

        fs.writeFileSync(outputPath, outputBuffer);
        console.log(`✅ 変換完了: ${file} → ${outputFileName}`);
      } catch (error) {
        console.error(`❌ 変換失敗: ${file}`, error);
      }
    }
  }
});
