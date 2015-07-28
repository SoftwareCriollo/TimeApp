class Api::MembersController < ApiController
  
 def find_member
   member = project_manager.find_member(params[:member_id])
   render json: member
 end

 private

 def project_manager
   @project_manager ||= ProjectManager.new
 end

end
