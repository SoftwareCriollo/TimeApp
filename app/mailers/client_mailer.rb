class ClientMailer < ActionMailer::Base

	default from: "notifications@softwarecriollo.com"

	def hapiness(client)
	  @client = client
	  if Rails.env == "production"
	    base_host = "http://time.softwarecriollo.com"
	  else
	  	base_host = "http://127.0.0.1:3000"
	  end

	  @url_good = base_host + "/votes/" + client.id  + "/positive" 
	  @url_bad = base_host + "/votes/" + client.id  + "/negative" 

		mail(to: @client.email, subject: "How did we do last week?")
	end

end