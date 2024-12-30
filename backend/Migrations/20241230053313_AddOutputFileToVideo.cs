using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiShortsGenerator.Migrations
{
    /// <inheritdoc />
    public partial class AddOutputFileToVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OutputFile",
                table: "Videos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OutputFile",
                table: "Videos");
        }
    }
}
