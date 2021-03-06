USE [C85_HubLink]
GO
/****** Object:  StoredProcedure [dbo].[Admin_SelectUserProfiles]    Script Date: 5/11/2020 1:57:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Admin_SelectUserProfiles]
	@PageIndex int, @PageSize int

AS
/*

declare @PageIndex int = 1, 
		@PageSize int = 4

execute [dbo].[Admin_SelectUserProfiles] @PageIndex, 
										 @PageSize

*/


BEGIN
Declare @Offset int = @PageIndex * @PageSize

SELECT

	u.[Id],
	up.[FirstName],
	up.[LastName],
	u.[Email],
	u.[UserStatusId],
	u.[IsConfirmed],
	r.[Name],
	up.[AvatarUrl],

	TotalCount = Count(1)Over()



	FROM [dbo].[Users] u 
	join [dbo].[UserProfiles] up 
	on u.Id = up.UserId
	join [dbo].[Roles] r
	on r.Id = u.RoleId

	Order By Id  
    OFFSET @offset rows
    fetch NEXT @pageSize Rows Only 
END