using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Users
{
    public class UserUpdateStatusRequest
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int UserStatusId { get; set; }
    }
}
