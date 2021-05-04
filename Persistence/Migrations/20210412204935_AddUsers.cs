using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RegistrationDate",
                table: "AspNetUsers",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Monitors_UserId",
                table: "Monitors",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Monitors_AspNetUsers_UserId",
                table: "Monitors",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Monitors_AspNetUsers_UserId",
                table: "Monitors");

            migrationBuilder.DropIndex(
                name: "IX_Monitors_UserId",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "RegistrationDate",
                table: "AspNetUsers");
        }
    }
}
