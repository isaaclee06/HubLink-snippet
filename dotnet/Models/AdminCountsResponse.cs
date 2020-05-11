using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Requests.Admin
{
    public class AdminCountsResponse
    {
        public int UserCount { get; set; }

        public int OrganizationCount { get; set; }

        public int ActiveUserCount {get; set;}

        public int DailyActiveUsersCount { get; set; }
    }
}
