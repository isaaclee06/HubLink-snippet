using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.UserDomains;
using Sabio.Models.Requests.Admin;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminApiController : BaseApiController
    {
        private IAdminService _adminService = null;
        private IAuthenticationService<int> _authService = null;
        private IStripeService _stripeService = null;

        public AdminApiController(IAdminService service
                                , IStripeService stripeService
                                , ILogger<UserApiController> logger
                                , IAuthenticationService<int> authService) : base(logger)
        {
            _adminService = service;
            _stripeService = stripeService;
            _authService = authService;
        }

        [HttpGet("profiles")]
        public ActionResult<Paged<UserProfile>> GetUserProfilesForActivation(int pageIndex, int pageSize)
        {
            int sCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<UserProfile> paged = _adminService.GetUserProfilesForActivation(pageIndex, pageSize);

                if (paged == null)
                {
                    sCode = 404;
                    response = new ErrorResponse("Users Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<UserProfile>> { Item = paged };
                }


            }
            catch (Exception ex)
            {
                sCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: { ex.Message }");
            }
            return StatusCode(sCode, response);
        }

        [HttpGet("profiles/search")]
        public ActionResult<Paged<UserProfile>> SearchUserProfilesForActivation(int pageIndex, int pageSize, string query)
        {
            int sCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<UserProfile> paged = _adminService.SearchUserProfilesForActivation(pageIndex, pageSize, query);

                if (paged == null)
                {
                    sCode = 404;
                    response = new ErrorResponse("Users Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<UserProfile>> { Item = paged };
                }


            }
            catch (Exception ex)
            {
                sCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: { ex.Message }");
            }
            return StatusCode(sCode, response);
        }

        [HttpGet("count")]
        public ActionResult<ItemResponse<AdminCountsResponse>> GetAllCountsForAdmin()
        {
            int sCode = 200;
            BaseResponse response = null;

            try
            {
                AdminCountsResponse counts = _adminService.GetAllCountsForAdmin();
                response = new ItemResponse<AdminCountsResponse> { Item = counts };
            }
            catch (Exception ex)
            {
                sCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: { ex.Message }");
            }
            return StatusCode(sCode, response);
        }

        [HttpPut("status")]
        public ActionResult<SuccessResponse> UpdateStatus(UserUpdateStatusRequest model)
        {
            int sCode = 200;
            BaseResponse response = null;

            try
            {
                _adminService.UpdateStatus(model);

                if (model.UserStatusId == 2)
                {
                    StripeCustomer customer = _stripeService.GetStripeCustomerByUserId(model.Id);
                    if (customer.SubscriptionTypeId != 1)
                    {
                        _stripeService.CancelSubscription(customer.SubscriptionId);
                        _stripeService.UpdateCustomerSubscriptions(model.Id, "none", "none");
                    }
                }
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                sCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: { ex.Message }");
            }


            return StatusCode(sCode, response);
        }

    }
}
