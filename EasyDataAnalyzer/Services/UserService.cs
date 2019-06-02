using EasyDataAnalyzer.Repositories;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDataAnalyzer.Services
{
    public class UserService : IUserService
    {
        private IUserRepository UserRepository { get; set; }

        public UserService(IUserRepository userRepository)
        {
            UserRepository = userRepository;
        }

        public IdentityUser GetUserById(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;
            }

            return UserRepository.GetUserById(userId);
        }
    }
}
