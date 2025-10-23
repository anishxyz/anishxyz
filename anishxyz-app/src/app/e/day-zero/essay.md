---
title: Vibe-coding on Rails
subtitle: how I use coding agents to build personal projects
date: October 13, 2025
author: Anish Agrawal
---
Vibe coding (today) generates disposable software — instant demos, fun games, quick tools. The fix is to give the coding agent rails. I tested this by trying to build an [integrations SDK](https://github.com/anishxyz/integrations). I wanted one package which could interface with many SaaS providers, à la Zapier, and turned to codegen to solve my problem. If I were to prompt a coding agent from scratch, I got a mess -- duplicated code, inconsistent interfaces, verbose files, bugs, etc. 

*Declarative Design*

Rails take upfront work; they keep your intentions aligned with the coding agent. I wrote a detailed `DESIGN.md` as if the SDK were finished, with usage flows, pseudocode, and notes on how it should feel to build with it. Design decisions for my SDK centered on maximizing developer experience and ease of integration. Specifically, I wanted the SDK to be async friendly, enable flexible auth scopes, and work with agents out of the box. 

I didn't one shot the design, instead asking Codex for reviews and ideas[^1]. This approach to programming allows you to inject taste into development and let the model in-context learn from it.

*Primitive Driven Development*

After a couple passes, I tried to generate the codebase from `DESIGN.md`. It was better than raw vibe coding, but still messy. The fix was primitives: small pre-built building blocks that act as a layer of abstraction between the developer and the coding agent. In the integrations SDK this was the abstract definitions for a provider and action: `BaseProvider` and `BaseAction`. The coding agent's task is now reduced to implementing `BaseProvider` to add an integration, like Github, implementing `BaseAction` to define actions, like creating a pull request, and some light wiring/testing. I can also keep building while the agent works behind the scenes—adding, for instance, a new tools feature to all actions—knowing it will mesh cleanly with the agent’s work. 

The acceleration from high-taste primitives becomes very noticeable. Codex was able to match Zapier's Github integrations in under an hour. I then spun up parallel cloud tasks to scale up to 10 integrations providers. It's now so easy to spin up integrations that the limiter is setting up a developer account on the provider site.

Primitive driven-development should be applied in all 0 -> 1 coding projects[^2]. I think it is the reason v0 became more functional than vibe coded frontend products; it relied on a strong primitive: shadcn/ui. The primitive can take many forms including components for frontend, interface definitions for SDKs, starter templates for services, etc[^3]. I am currently applying it to CRUD API's to make a CRUD service generator[^4]. 

*Memory*

Throughout development there's a back and forth with the coding agent for reviews, fixes, adjustments etc. It's important to constantly serialize taste and decisions, as you would with human teammates. In this arrangement its easier though since its autonomous! You just need to let the agent track this in a file. For the integrations SDK I had the agent keep a `CONTRIBUTING.md` file up to date. I would expect for larger projects this grows into a directory. It's elegant since it's autonomous and default-organized for humans and coding agents[^5]. I have found it to be the most performant implementation of memory.

Notedly, the above rails resemble how you’d work with humans: planning, tooling (primitives), and documentation. As coding agents evolve, we’ll continue abstracting ourselves from implementation toward intent[^6]. I expect coding products to offer first class experiences for the above rails which may even make it into the model layer.

Happy coding.


[^1]: Codex came up with the idea to use an async context manager for auth principal overrides. 

[^2]: For existing projects, the primitive is the codebase. Coding agents have been remarkably good at adapting to diverse codebases.

[^3]: I was reminded by a colleague that this is how human developers work too. Most companies have internal tools to initialize projects -- why should this be different for coding agents?

[^4]: It is a running joke that SaaS reduces down to CRUD services. I wrote a starter template which spins up Postgres and FastAPI, allowing a coding agent to build and deploy a CRUD service in an hour. In the future it will have access to more infra (Redis, long running jobs, etc) with my benchmark being one-shotting Slack.

[^5]: Coding agents are post-trained to explore directories in codebases, reducing the memory problem to an in-distribution case.

[^6]: I think a catalyst for this will be multi-agent architectures. Currently, agents are a single thread with some context tricks. This is because the current SOTA LLM’s do not do well with sub-agents. Related blog post by Cognition: [https://cognition.ai/blog/dont-build-multi-agents](https://cognition.ai/blog/dont-build-multi-agents)
