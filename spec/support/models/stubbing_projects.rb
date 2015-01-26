def stubbing_project_manager
  allow_any_instance_of(ProjectManager).to receive(:find_organization).and_return(Trello::Organization.new)
  allow_any_instance_of(ProjectManager).to receive(:task_name).and_return("task_name")
  allow_any_instance_of(ProjectManager).to receive(:project_name).and_return("project_name") 
end