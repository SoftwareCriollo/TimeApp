class Api::ProjectsController < ApiController
#  before_action :project_manager

 # include ProjectManagerConcern

  def index
    boards = project_manager.boards_serialized
    render json: boards
  end

  def cards
    cards = project_manager.cards_serialized(params[:id])
    render json: cards
  end

  private

  def project_manager
    @project_manager ||= ProjectManager.new
  end

end