using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace QnA.Controllers
{
    //[Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public void WriteToFile()
        {
            Response.ContentType = "text/xml";
            // Read XML posted via HTTP
            StreamReader reader = new StreamReader(Request.InputStream);
            string xmlData = reader.ReadToEnd();

            XmlDocument xdoc = new XmlDocument();
           
            if (CheckIfValidXML(xmlData))
            {
                xdoc.LoadXml(xmlData);
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
