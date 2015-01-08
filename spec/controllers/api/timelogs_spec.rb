require 'rails_helper'

RSpec.describe Api::TimelogsController, :type => :controller do

describe 'POST #create' do

  context 'Create new Timelog' do
    let(:timelog){FactoryGirl.attributes_for(:timelog) }
    it 'Redirects them to their /' do
      post :create, timelog: timelog
      expect(response.status).to eq(201)
    end
    end
end

end