using Sabio.Models;
using Sabio.Models.Domain.UserDomains;
using Sabio.Models.Requests.Admin;
using Sabio.Models.Requests.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services.Interfaces
{
    public interface IAdminService
    {
        AdminCountsResponse GetAllCountsForAdmin();
        void UpdateStatus(UserUpdateStatusRequest model);

        Paged<UserProfile> GetUserProfilesForActivation(int pageIndex, int pageSize);

        Paged<UserProfile>  SearchUserProfilesForActivation(int pageIndex, int pageSize, string query);
    }
}
