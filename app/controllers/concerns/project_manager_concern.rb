module ProjectManagersConcern
  before_action :project_manager
  def project_manager
    @project_manager ||= ProjectManager.new
  end
end