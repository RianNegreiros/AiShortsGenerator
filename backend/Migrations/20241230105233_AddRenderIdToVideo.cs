using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiShortsGenerator.Migrations
{
    /// <inheritdoc />
    public partial class AddRenderIdToVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RenderId",
                table: "Videos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RenderId",
                table: "Videos");
        }
    }
}
