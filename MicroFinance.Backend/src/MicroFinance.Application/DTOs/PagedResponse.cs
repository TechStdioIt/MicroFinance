using System.Collections.Generic;

namespace MicroFinance.Application.DTOs
{
    public class PagedResponse<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
        
        public PagedResponse()
        {
            Items = new List<T>();
        }
        
        public PagedResponse(IEnumerable<T> items, int totalCount, int skip, int take)
        {
            Items = items;
            TotalCount = totalCount;
            Skip = skip;
            Take = take;
        }

    }
}
