using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace MicroFinance.Application.Common.Interfaces.IServices
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string folderName);
        void DeleteFile(string fileUrl);
    }
}
