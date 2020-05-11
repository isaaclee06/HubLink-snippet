using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.UserDomains;
using Sabio.Models.Requests.Admin;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class AdminService: IAdminService
    {
        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;

        public AdminService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
        }

        public AdminCountsResponse GetAllCountsForAdmin()
        {
            AdminCountsResponse response = new AdminCountsResponse();

            _dataProvider.ExecuteCmd(
                "[dbo].[Admin_SelectAdminCounts]", inputParamMapper: null,
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    response.UserCount = reader.GetSafeInt32(startingIndex++);
                    response.OrganizationCount = reader.GetSafeInt32(startingIndex++);
                    response.ActiveUserCount = reader.GetSafeInt32(startingIndex++);
                    response.DailyActiveUsersCount = reader.GetSafeInt32(startingIndex++);
                }
                );
            
            return response;
        }

        public Paged<UserProfile> GetUserProfilesForActivation(int pageIndex, int pageSize)
        {
            Paged<UserProfile> pagedResult = null;

            List<UserProfile> result = null;

            int userCount = 0;

        _dataProvider.ExecuteCmd(
                "[dbo].[Admin_SelectUserProfiles]",
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@pageIndex", pageIndex);
                    paramCollection.AddWithValue("@pageSize", pageSize);

                }, delegate (IDataReader reader, short set)
                {
                    UserProfile user = new UserProfile();

                    user = MapUser(reader);

                    if (userCount == 0)
                    {
                        userCount = reader.GetSafeInt32(8);
                    }


                    if (result == null)
                    {
                        result = new List<UserProfile>();
                    }

                    result.Add(user);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<UserProfile>(result, pageIndex, pageSize, userCount);
            }

            return pagedResult;
        }

        public Paged<UserProfile> SearchUserProfilesForActivation(int pageIndex, int pageSize, string query)
        {
            Paged<UserProfile> pagedResult = null;

            List<UserProfile> result = null;

            int userCount = 0;

            _dataProvider.ExecuteCmd(
                    "[dbo].[Admin_SearchUserProfiles]",
                    delegate (SqlParameterCollection paramCollection)
                    {
                        paramCollection.AddWithValue("@PageIndex", pageIndex);
                        paramCollection.AddWithValue("@PageSize", pageSize);
                        paramCollection.AddWithValue("@Query", query);

                    }, delegate (IDataReader reader, short set)
                    {
                        UserProfile user = new UserProfile();

                        user = MapUser(reader);

                        if (userCount == 0)
                        {
                            userCount = reader.GetSafeInt32(8);
                        }


                        if (result == null)
                        {
                            result = new List<UserProfile>();
                        }

                        result.Add(user);
                    }
                );
            if (result != null)
            {
                pagedResult = new Paged<UserProfile>(result, pageIndex, pageSize, userCount);
            }

            return pagedResult;
        }

        public void UpdateStatus(UserUpdateStatusRequest model)
        {
            _dataProvider.ExecuteNonQuery("[dbo].[Users_UpdateStatus]",
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@UserStatusId", model.UserStatusId);
                });
        }

        private UserProfile MapUser(IDataReader model)
        {
            UserProfile user = new UserProfile();
            int startingIndex = 0;

            user.Id = model.GetSafeInt32(startingIndex++);
            user.FirstName = model.GetSafeString(startingIndex++);
            user.LastName = model.GetSafeString(startingIndex++);
            user.Email = model.GetSafeString(startingIndex++);
            user.UserStatusId = model.GetSafeInt32(startingIndex++);
            user.IsConfirmed = model.GetSafeBool(startingIndex++);
            user.UserRole = model.GetSafeString(startingIndex++);
            user.AvatarUrl = model.GetSafeString(startingIndex++);


            return user;
        }
    }
}
