USE [C85_HubLink]
GO
/****** Object:  StoredProcedure [dbo].[Admin_SearchUserProfiles]    Script Date: 5/11/2020 1:55:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROC [dbo].[Admin_SearchUserProfiles]
	@PageIndex int, @PageSize int, @Query nvarchar(250)

AS
/*

declare @PageIndex int = 0, @PageSize int = 4, @Query nvarchar(250) = 'James'

execute [dbo].[Admin_SearchUserProfiles] @PageINdex, @PageSize, @Query

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

	WHERE   (up.FirstName LIKE '%' + @Query + '%') OR
			    (up.LastName LIKE '%' + @Query + '%') OR
			    (u.Email LIKE '%' + @Query + '%')

	Order By Id  
    OFFSET @offset rows
    fetch NEXT @pageSize Rows Only 
END