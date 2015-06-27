class Api::TimelineController < ApiController
  
 def index
   cards = project_manager.cards_to_json(params[:project_id])
   render json: cards
 end

 private

 def project_manager
   @project_manager ||= ProjectManager.new
 end

end
