export default function Formatter(value:number) {
  let short:string;
  var suffixes = ["", "k", "m", "b","t"];
  var suffixNum = Math.floor((""+value).length/3);
  var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
  if (shortValue % 1 != 0) {
      short = shortValue.toFixed(1);
      return short+suffixes[suffixNum];
  }
  return shortValue+suffixes[suffixNum];
}