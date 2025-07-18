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
    const ext = path.extname(file);
    if (ext.toLowerCase() === ".heic") {
      const inputPath = path.join(inputDir, file);

      // 拡張子を除いたベース名を取得（元のファイル名そのまま使うと HEIC.jpg になる問題を回避）
      const baseName = path.basename(file, ext); // ここで ext は元の大小を保っている
      const outputFileName = baseName + ".jpg";
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
