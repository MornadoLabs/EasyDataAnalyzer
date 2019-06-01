using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Repositories
{
    public interface IUserRepository
    {
        IdentityUser GetUserById(string userId);
    }
}
