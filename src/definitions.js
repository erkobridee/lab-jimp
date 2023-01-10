const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

const FILES_DIR = path.join(ROOT_DIR, "files");

const INPUT_DIR = path.join(FILES_DIR, "input");

const OUTPUT_DIR = path.join(FILES_DIR, "output");

//----------------------------------------------------------------------------//

const sealTemplateBgColor = "#FFFFFF";
const sealTemplateWidth = 480;
const sealTemplateHeight = 210;
const sealTemplateScale = 0.5;

//---===---//

const buildInputFilePath = (inputFile = "erko_avatar.png") =>
  path.join(INPUT_DIR, inputFile);

const buildOuputFilePath = ({
  outputFileName = "seal-image-result",
  fileExt = "png",
}) => path.join(OUTPUT_DIR, `${outputFileName}.${fileExt}`);

//----------------------------------------------------------------------------//

module.exports = {
  sealTemplateBgColor,
  sealTemplateWidth,
  sealTemplateHeight,
  sealTemplateScale,
  buildInputFilePath,
  buildOuputFilePath,
};
