using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddNotificationsSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExpiryNotificationThreshold",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "NotificationsEmail",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyAboutCertificateChange",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyAboutExpiryIfRenewalConfigured",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiryNotificationThreshold",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotificationsEmail",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotifyAboutCertificateChange",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotifyAboutExpiryIfRenewalConfigured",
                table: "AspNetUsers");
        }
    }
}
