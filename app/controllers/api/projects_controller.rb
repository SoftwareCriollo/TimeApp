class Projects < ApiController
  include ProjectManagerConcern

  def index
    project_manager.boards_serialized
  end

end