class Api::TimelogsController <  ApiController

  def create
    @timelog = Timelog.new(timelog_params)

    respond_to do |format|
      if  @timelog.save
        format.html { redirect_to "/", notice: 'User was successfully created.' }
      else
        format.html { redirect_to '/', notice: 'Error saving property'}
      end
    end
  end

  def timelog_params
    params.require(:timelog).permit(:project_id, :project_name, :task_id, :comment, :time, :user_id, :fecha, :trello, :iteration_id, :value_ajust)
  end 

end
