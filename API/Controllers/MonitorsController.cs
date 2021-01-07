using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Monitors;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MonitorsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<Monitor>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        // [HttpGet("{monitorId}")]
        // public async Task<ActionResult<Monitor>> Details(Guid monitorId)
        // {
        //     return await Mediator.Send(new Details.Query {Id = dictionaryId});
        // }

        [HttpPost]
        public async Task<ActionResult<Monitor>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        // [HttpDelete("{dictionaryId}")]
        // [Authorize(Policy = "IsDictionaryOwner")]
        // public async Task<ActionResult<Unit>> Delete(Guid dictionaryId)
        // {
        //     return await Mediator.Send(new Delete.Command {Id = dictionaryId});
        // }
    }
}