using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Domain.UserDomains
{
    public class UserProfile : BaseUser
    {
        public int ProfileId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Mi { get; set; }

        public string AvatarUrl { get; set; }

        public List<UserEmail> UserEmails { get; set; }

        public List<UserPhone> UserPhones { get; set; }
    }
}
