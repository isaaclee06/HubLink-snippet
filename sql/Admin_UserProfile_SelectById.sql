USE [C85_HubLink]
GO
/****** Object:  StoredProcedure [dbo].[Admin_UserProfile_SelectById]    Script Date: 5/11/2020 1:57:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[Admin_UserProfile_SelectById]
		@UserId int

AS
/*-----Test Code-----

	DECLARE
		@UserId int = 141;
	EXECUTE
		[dbo].[Admin_UserProfile_SelectById]
			@UserId

------Test End-----*/
BEGIN

	SELECT
			UP.[UserId] as ProfileId
			,UP.[FirstName]
			,UP.[LastName]
			,UP.[Mi]
			,UP.[AvatarUrl]
			,US.[Id] as UserId
			,US.[Email]
			,US.[IsConfirmed]
			,USt.[Id] as UserStatusId
			,USt.[Name] as UserStatus
			,R.[Id] as RoleId
			,R.[Name] as UserRole
	FROM [dbo].[UserProfiles] AS UP
		JOIN [dbo].[Users] AS US
			ON UP.UserId = US.Id
		JOIN [dbo].[UserStatus] AS USt
			ON USt.Id = US.UserStatusId
		JOIN [dbo].[Roles] AS R
			ON R.Id = US.RoleId
	WHERE
		US.Id = @UserId;
  
    SELECT  
			UE.[Email]
	        ,UE.[IsPrimary]
	FROM [dbo].[UserEmails] AS UE 
		JOIN [dbo].[Users] as US
			ON US.Id = UE.UserId
	WHERE
		US.Id = @UserId

    SELECT
			UPh.[UserId]
			,UPh.[Phone]
	        ,UPh.[IsPrimary]
	FROM [dbo].[UserPhones] AS UPh
		JOIN [dbo].[Users] as US
			ON US.Id = UPh.UserId
	WHERE US.Id = @UserId

END