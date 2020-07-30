
export function xmlToJson (xml, pro_resoponse, pro_result) {
  let parser = new DOMParser()
  let xmlDoc = parser.parseFromString(xml, 'text/xml')
  let Result = xmlDoc.getElementsByTagName(pro_resoponse)[0].getElementsByTagName(pro_result)[0]
  let HtmlStr = Result.innerHTML
  return JSON.parse(HtmlStr)
}
export function combineRequsetData (targetName, mainData) {
  let tmpData = '<?xml version="1.0" encoding="utf-8"?>'
        tmpData += '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> '
        tmpData += '<soap:Body> '
        tmpData += '<' + targetName + ' xmlns="http://tempuri.org/">'
        tmpData += mainData
        tmpData += '</' + targetName + '>'
        tmpData += '</soap:Body>'
        tmpData += '</soap:Envelope>'
  return tmpData
}