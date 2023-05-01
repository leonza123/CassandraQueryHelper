using CassandraWebUI.Models;
using Newtonsoft.Json;

namespace CassandraWebUI.Helpers
{
    public class FileHelper
    {
        public static string GetFullPath(string path)
        {
            return Path.GetFullPath(path);
        }

        public static string[] GetFilePaths(string path) 
        {
            return Directory.GetFiles(path);
        }

        public static void CreateDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public static void WriteToFile(string fullPath, string text)
        {
            using (StreamWriter sw = File.CreateText(fullPath))
            {
                sw.Write(text);
            }
        }

        public static string ReadFromFile(string path) 
        {
            using (StreamReader r = new StreamReader(path))
            {
                return r.ReadToEnd();
            }
        }

        public static bool FileExists(string path) 
        {
            return File.Exists(path);
        }
    }
}
