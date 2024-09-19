 ## Workflow Orchestrator

 ### Workflow Orchestrator --> Command Centers --> Processors

 #### Rules

 - One parent Command Center Model across workflow 
 - One parent Command Center Delegate across workflow  
 - No system dependent calls from workflow
 - No Logic inside the delegates and delegate all the system calls
 - processor process the action, data, design via command center
 - All Processors are initialized by workflow orchestrator

