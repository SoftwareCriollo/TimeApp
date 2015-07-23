class Api::TimelineController < ApiController
  
 def index
   cards = project_manager.cards_by_board_due(params[:project_id])
   render json: cards
 end

 def all_timeline
   cards = project_manager.all_cards
   render json: cards
 end

 private

 def project_manager
   @project_manager ||= ProjectManager.new
 end

end
