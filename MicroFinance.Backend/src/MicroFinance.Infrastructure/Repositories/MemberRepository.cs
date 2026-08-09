using MicroFinance.Application.Common.Interfaces.IRepositories;
using MicroFinance.Domain.Entities;
using MicroFinance.Infrastructure.DataContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicroFinance.Infrastructure.Repositories
{
    public class MemberRepository : IMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public MemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Member> AddAsync(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task<(IEnumerable<Member> Items, int TotalCount)> GetPagedAsync(int skip, int take, string search = "")
        {
            var query = _context.Members.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.ToLower();
                query = query.Where(m => 
                    m.FirstName.ToLower().Contains(q) || 
                    m.LastName.ToLower().Contains(q) || 
                    m.NidNumber.ToLower().Contains(q) || 
                    m.MemberNo.ToLower().Contains(q) ||
                    m.Phone.ToLower().Contains(q)
                );
            }

            var totalCount = await query.CountAsync();
            var items = await query.OrderByDescending(m => m.JoinDate).Skip(skip).Take(take).ToListAsync();

            return (items, totalCount);
        }

        public async Task<Member> GetByIdAsync(Guid id)
        {
            return await _context.Members.FindAsync(id);
        }

        public async Task UpdateAsync(Member member)
        {
            _context.Members.Update(member);
            await _context.SaveChangesAsync();
        }
    }
}
