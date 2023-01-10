const Jimp = require("jimp");

const {
  sealTemplateBgColor,
  sealTemplateWidth,
  sealTemplateHeight,
  sealTemplateScale,
  buildInputFilePath,
  buildOuputFilePath,
} = require("./definitions");

//----------------------------------------------------------------------------//

const makeIteratorThatFillsWithColor = (data, color) => (_, __, offset) => {
  data.writeUInt32BE(color, offset);
};

const setBorder = ({ image, borderThickness = 1, borderColor = "#FAFAFA" }) => {
  const { data, width, height } = image.bitmap;
  const fillFn = makeIteratorThatFillsWithColor(
    data,
    Jimp.cssColorToHex(borderColor)
  );

  image.scan(0, 0, width, borderThickness, fillFn);
  image.scan(0, 0, borderThickness, height, fillFn);
  image.scan(width - borderThickness, 0, borderThickness, height, fillFn);
  image.scan(0, height - borderThickness, width, borderThickness, fillFn);
};

//----------------------------------------------------------------------------//

const PADDING = 10;

const generateSealImage = async () => {
  const background = new Jimp(
    sealTemplateWidth,
    sealTemplateHeight,
    sealTemplateBgColor,
    (err) => {
      if (err) throw err;
    }
  );

  const inputFilePath = buildInputFilePath();

  const avatar = await Jimp.read(inputFilePath);

  const { width: avatarWidth, height: avatarHeight } = avatar.bitmap;
  const avatarAspectRatio = avatarWidth / avatarHeight;

  const halfContentHeight = Math.floor((sealTemplateHeight - PADDING * 2) / 2);

  const newAvatarWidth = halfContentHeight * avatarAspectRatio;
  const newAvatarHeight = halfContentHeight;

  await avatar.resize(newAvatarWidth, newAvatarHeight);

  const newAvatarX = sealTemplateWidth - (newAvatarWidth + PADDING);
  const newAvatarY = sealTemplateHeight - (newAvatarHeight + PADDING);

  //---===---//

  /*
    composite
      sourceImage
      x
      y
  */
  const seal = await background.composite(avatar, newAvatarX, newAvatarY);

  setBorder({ image: seal });

  if (sealTemplateScale !== 1) {
    seal.scale(sealTemplateScale);
  }

  const outputFilePath = buildOuputFilePath({ fileExt: seal.getExtension() });

  await seal.write(outputFilePath);
};

(async () => {
  const timeLabel = "generateSealImage";

  console.time(timeLabel);

  await generateSealImage();

  console.log(" ");
  console.timeEnd(timeLabel);
  console.log(" ");
})();
