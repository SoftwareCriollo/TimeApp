class Api::IterationsController <  ApiController

  def create
    @iteration= Iteration.new(iteration_params)

    respond_to do |format|
      if  @iteration.save
        format.html { redirect_to "/", notice: 'User was successfully created.' }
      else
        format.html { redirect_to '/', notice: 'Error saving property'}
      end
    end
  end

  def iteration_params
    params.require(:iteration).permit(:project_id, :time, :note, :start, :end_date)
  end 

end
