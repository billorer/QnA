using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace QnA.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost, ValidateInput(false)]
        public void WriteToFile(string xml)
        {
            XmlDocument xdoc = new XmlDocument();
            if (CheckIfValidXML(xml))
            {
                xdoc.LoadXml(xml);
                xdoc.Save(@"c:\qna.xml");
            }

        }

        public bool CheckIfValidXML(string str)
        {
            if (str.TrimStart().StartsWith("<"))
            {
                try
                {
                    var doc = XDocument.Parse(str);
                    return true;
                }
                catch (Exception ex) { return false; }
            }
            else
            {
                return false;
            }
        }
    }
}
