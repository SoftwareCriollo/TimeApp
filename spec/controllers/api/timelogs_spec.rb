require 'rails_helper'

RSpec.describe Api::TimelogsController, :type => :controller do

  describe 'POST #create' do
    let(:timelog_1){ attributes_for(:timelog)}
    let!(:iteration){ create(:iteration, project_id:"is-an-id",start: DateTime.now - 1.day)}
    let(:attributes){ {project_id: "is-an-id", project_name: "this is my name", timelogs_attributes: [timelog_1]}}

    let(:valid_request){ post :create, timelogger: attributes, project_id: 'project_id' }
    let(:invalid_request) { post :create, timelogger: {no_attr: "not"}, project_id: 'project_id' }
    include_examples "resource", Timelog
  end
end
