interface IIEDocument extends Document {
  documentMode?: number;
}

export default function isIE(): boolean {
  /* eslint-disable-next-line */
  return window && /*@cc_on!@*/false || !!(document as IIEDocument).documentMode;
}
