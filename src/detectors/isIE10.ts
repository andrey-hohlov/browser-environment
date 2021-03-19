interface IIEDocument extends Document {
  documentMode?: number;
}

export default function isIE10(): boolean {
  return window && (document as IIEDocument).documentMode === 10;
}
