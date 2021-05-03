using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class RemoveAdditionalRenewalScripts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostRenewalScript",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "PreRenewalScript",
                table: "Monitors");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PostRenewalScript",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreRenewalScript",
                table: "Monitors",
                type: "text",
                nullable: true);
        }
    }
}
