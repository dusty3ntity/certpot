using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class AddMonitorRenewal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ExpiryNotificationThreshold",
                table: "AspNetUsers",
                newName: "RenewalThresholdDays");

            migrationBuilder.AddColumn<bool>(
                name: "IsInRenewalQueue",
                table: "Monitors",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRenewing",
                table: "Monitors",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastRenewalDate",
                table: "Monitors",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "LastRenewalLogs",
                table: "Monitors",
                type: "text",
                nullable: true);

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

            migrationBuilder.AddColumn<int>(
                name: "RenewalErrorCode",
                table: "Monitors",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RenewalScript",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SshHostname",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SshPassword",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SshPort",
                table: "Monitors",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SshPrivateKey",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SshUsername",
                table: "Monitors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "WasRenewalSuccessful",
                table: "Monitors",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExpiryNotificationThresholdDays",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInRenewalQueue",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "IsRenewing",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "LastRenewalDate",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "LastRenewalLogs",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "PostRenewalScript",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "PreRenewalScript",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "RenewalErrorCode",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "RenewalScript",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "SshHostname",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "SshPassword",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "SshPort",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "SshPrivateKey",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "SshUsername",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "WasRenewalSuccessful",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "ExpiryNotificationThresholdDays",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "RenewalThresholdDays",
                table: "AspNetUsers",
                newName: "ExpiryNotificationThreshold");
        }
    }
}
