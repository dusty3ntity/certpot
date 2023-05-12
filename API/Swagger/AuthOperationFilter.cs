using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Swagger;

class AuthOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext ctx)
    {
        if (ctx.ApiDescription.ActionDescriptor is ControllerActionDescriptor descriptor)
        {
            // If there is no [AllowAnonymous] and [Authorize] on either the endpoint or the controller
            if (!ctx.ApiDescription.CustomAttributes().Any((a) => a is AllowAnonymousAttribute))
            {
                operation.Security.Add(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] { }
                        }
                    });
            }
        }
    }
}