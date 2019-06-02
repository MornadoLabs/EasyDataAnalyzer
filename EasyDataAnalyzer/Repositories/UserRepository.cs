using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDataAnalyzer.Data;
using Microsoft.AspNetCore.Identity;

namespace EasyDataAnalyzer.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public IdentityUser GetUserById(string userId)
        {
            return DbContext.Users.FirstOrDefault(u => userId.Equals(u.Id));
        }
    }
}
