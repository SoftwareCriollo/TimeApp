class Api::ProjectsController < ApiAuthenticatedController
  skip_before_action :restrict_access, :only => [:cards, :index, :name]
#  before_action :project_manager

  def index
    boards = project_manager.boards_serialized
    render json: boards
  end

  def cards
    cards = project_manager.cards_by_board(params[:id])
    render json: cards
  end

  def name
    project = project_manager.project_name(params[:project_id])
    render json: project.to_json
  end

  private

  def project_manager
    @project_manager ||= ProjectManager.new
  end

end