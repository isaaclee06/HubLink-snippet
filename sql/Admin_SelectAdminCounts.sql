USE [C85_HubLink]
GO
/****** Object:  StoredProcedure [dbo].[Admin_SelectAdminCounts]    Script Date: 5/11/2020 1:56:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[Admin_SelectAdminCounts]

as
/*

execute Admin_SelectAdminCounts


*/

BEGIN

declare @today date = GetUtcDate()




SELECT (SELECT COUNT(1) FROM Users) as UserCount,
	   (SELECT COUNT(1) FROM Organizations) as OrgainizationCount,
	   (SELECT COUNT(1) FROM Users where UserStatusId = 1) as AcvtiveUserCount,
	   (SELECT Count(Distinct UserId) FROM UserLogins Where LogInTime > @today or IsLoggedIn = 1) as DailyActiveUserCount,
	   (SELECT COUNT(1) FROM StripeCustomers where SubscriptionTypeId != 1 ) as ActiveSubscriptions,
	   (SELECT COUNT(1) FROM StripeCustomers where SubscriptionTypeId = 3 ) as MonthlySubs,
	   (SELECT COUNT(1) FROM StripeCustomers where SubscriptionTypeId = 2 ) as AnnualSubs

END