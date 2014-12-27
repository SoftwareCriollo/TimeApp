module ProjectManagersConcern

  def project_manager
    @project_manager ||= ProjectManager.new
  end
end