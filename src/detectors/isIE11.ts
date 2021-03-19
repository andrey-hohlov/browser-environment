interface IIEDocument extends Document {
  documentMode?: number;
}

export default function isIE11(): boolean {
  return window && (document as IIEDocument).documentMode === 11;
}
